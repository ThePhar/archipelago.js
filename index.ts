import moduleAlias from "module-alias";

// Set up module aliases.
moduleAlias.addAliases({
    "@enums": __dirname + "/enums",
    "@packets": __dirname + "/packets",
    "@structs": __dirname + "/structs",
});

// Export files from folders.
export * from "./enums";
export * from "./packets";
export * from "./structs";

// Export all other files.
export * from "./ArchipelagoClient";
