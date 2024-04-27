import { Actant } from "@/types/Actant";
import { Agent } from "@/types/Agent";
import { Clause } from "@/types/Clause";
import { Report } from "@/types/Report";
import { createClient, groq } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-05-01",
  useCdn: true,
});

export async function getActants(): Promise<Actant[]> {
  return client.fetch(
    groq`*[_type == "actant"]{
        name,
        "image": image.asset->url
    }`
  );
}

export async function getAgents(): Promise<Agent[]> {
  return client.fetch(
    groq`*[_type == "agent"]{
        name,
    }`
  );
}

export async function getAgent(email: string): Promise<Agent> {
  return client.fetch(
    groq`*[_type == "agent" && email == $email][0]{
        name,
        email,  
        motto,
        "image": image.asset->url,
    }`,
    { email: email }
  );
}

export async function getClause(): Promise<Clause[]> {
  return client.fetch(
    groq`*[_type == "clause"]{
        name,
        responsibilityHolder[0]->{"image": image.asset->url},
        rightHolder[0]->{"image": image.asset->url}
    }`
  );
}

export async function getReports(): Promise<Report[]> {
  return client.fetch(
    groq`*[_type == "report"]{
        name,
        "slug": slug.current,
        "image": image.asset->url, 
        clause[0]->{name},
        content
    }`
  );
}