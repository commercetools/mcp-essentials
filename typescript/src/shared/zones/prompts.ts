export const readZonePrompt = `
Read zones from the commercetools platform. You can:
- Get a single zone by providing either its ID or key
- List multiple zones with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific zone to retrieve (optional)
- key: The key of a specific zone to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["name asc", "createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["name=\\"Europe\\""])
- expand: Reference paths to expand (e.g., ["custom.type"])

Examples:
// Get by ID
zones.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
zones.read({
  key: "europe-zone"
})

// List with filtering
zones.read({
  limit: 10,
  where: ["name=\\"Europe\\""]
})
`;

export const createZonePrompt = `
Create a new zone in the commercetools platform.

Parameters:
- key: User-defined unique identifier (optional)
- name: Name of the zone (required)
- description: Description of the zone (optional)
- locations: Array of locations in the zone (required)
- custom: Custom fields for the zone (optional)

Example:
zones.create({
  key: "europe-zone",
  name: "Europe",
  description: "European Union countries",
  locations: [
    {
      country: "DE",
      state: "Bavaria"
    },
    {
      country: "FR"
    }
  ]
})
`;

export const updateZonePrompt = `
Update a zone in the commercetools platform. You must identify the zone using either ID or key.

Parameters:
- id: The ID of the zone to update (optional if key is provided)
- key: The key of the zone to update (optional if id is provided)
- version: Expected version of the zone (required)
- actions: Array of update actions (required)

Available update actions:
- changeName: Change the name of the zone
- setDescription: Set or remove the description of the zone
- addLocation: Add a location to the zone
- removeLocation: Remove a location from the zone
- setKey: Set or remove the key of the zone
- setCustomType: Set or remove the custom type of the zone
- setCustomField: Set or remove a custom field of the zone

Examples:
// Update by ID
zones.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "changeName",
      name: "Updated Zone Name"
    }
  ]
})

// Update by key
zones.update({
  key: "europe-zone",
  version: 1,
  actions: [
    {
      action: "addLocation",
      location: {
        country: "IT"
      }
    }
  ]
})
`;
