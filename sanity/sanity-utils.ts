import { Actant } from "@/types/Actant";
import { Agent } from "@/types/Agent";
import { Clause } from "@/types/Clause";
import { Report } from "@/types/Report";
import { createClient, groq } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.NEXT_PUBLIC_SANITY_CRUD_EDITOR;

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-04-01",
  token: token,
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

export async function getActantsByAgent(agent: string): Promise<Actant[]> {
  return client.fetch(
    groq`*[_type == "actant" && references(*[_type == "agent" &&  name match $name]._id) ]{
  name, "slug": slug.current, "image": image.asset->url
}`,
    { name: agent }
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

export async function getActant(slug: string): Promise<Actant> {
  return client.fetch(
    groq`*[_type == "actant" && slug.current == $slug][0]{
        "id": _id,
        name,
        slug,  
        "image": image.asset->url,
    }`,
    { slug: slug }
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
        type, 
        clause->{name},
        reporter->{name, "image": image.asset->url},
        "image": image.asset->url,
    }`
  );
}

export async function getReportsByAgent(agent: string): Promise<Report[]> {
  return client.fetch(
    groq`*[_type == "report" && $agent match reporter->name]{
        name,
        "slug": slug.current,
        type, 
        clause->{name},
        reporter->{name, "image": image.asset->url},
        "image": image.asset->url,
    }`,
    { agent: agent }
  );
}

export async function createActant(actant: unknown) {
  const result = client.create(actant as unknown as any);
  return result;
}

export async function updateActant(id: string, name: string) {
  return client
    .patch(id) // Document ID to patch
    .set({ name: name }) // Shallow merge
    .commit(); // Perform the patch and return a promise
}

export async function getActantIdbySlug(slug: string): Promise<string> {
  return client.fetch(
    groq`*[_type == "actant" && slug.current match $slug][0]._id
    `,
    { slug: slug }
  );
}
