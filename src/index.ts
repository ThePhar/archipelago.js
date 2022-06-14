import moduleAlias from "module-alias";
import { ArchipelagoClient } from "@structs";

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

// Set default export.
export default ArchipelagoClient;
