import type { StructuredData } from "@/types";
import type { Graph, Organization, Thing, WebSite } from "schema-dts";

export function hasType(entity: Thing, type: Exclude<Thing, string>["@type"]): boolean {
  if (typeof entity === "string") return false;

  const entityType = entity["@type"];

  return Array.isArray(entityType) ? entityType.includes(type) : entityType === type;
}

export type CreateStructuredDataOptions = {
  name: string;
  url: URL;
  data: StructuredData;
};
export function createStructuredData({
  url,
  name,
  data: _data,
}: CreateStructuredDataOptions): Graph {
  const entities = (Array.isArray(_data) ? _data : (_data["@graph"] ?? [])) as Thing[];

  const hasOrganization = entities.some((entity) => hasType(entity, "Organization"));

  const hasWebSite = entities.some((entity) => hasType(entity, "WebSite"));

  const organization: Organization = {
    "@type": "Organization",
    "@id": `${url.origin}/#organization`,
    name,
    url: url.origin,
  };

  const webSite: WebSite = {
    "@type": "WebSite",
    "@id": `${url.origin}/#website`,
    name,
    url: url.origin,
  };

  if (!hasOrganization) {
    entities.unshift(organization);
  }

  if (!hasWebSite) {
    entities.unshift(webSite);
  }

  return {
    "@context": "https://schema.org",
    "@graph": entities,
  };
}
