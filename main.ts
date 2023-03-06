import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";

import K from "./K.ts";

const args = parse(Deno.args);
const path = Deno.cwd();

console.log(path);
console.log(args);
print_help();

// if (args._.length && typeof args._[0] === "string") {
//   const given_path = args._[0];
//   const specified_path_info = await Deno.stat(given_path);

//   if (specified_path_info.isFile) {
//     console.log("Deleting...");
//     await Deno.remove(given_path);
//     console.log(`Successfully deleted this file: ${given_path}`);
//   }
// }

function print_help() {
  console.log(`PowerDelete ${K.VERSION}`);
  console.log();
  console.log("USAGE:");
  console.group();
  console.log("pd [PATH] [OPTIONS]");
  console.groupEnd();
  console.log();
  console.log("PATH:");
  console.group();
  console.log("-> The path to the entry where delete operations will happen.");
  console.log(
    "-> If the provided path is pointing to a file, then that file will be automatically deleted."
  );
  console.log("-> if the provided path is pointing to a directory:");
  console.group();
  console.log("-> That directory will be deleted if it's empty.");
  console.log(
    "-> If it's not empty, then, you need to pick some options from the list bellow to customize the deletion."
  );
  console.groupEnd();
  console.log(
    "-> The path defaults to the current working directory if nothing was provided."
  );
  console.groupEnd();
  console.log();
  console.log("OPTIONS:");
  console.group();
  console.log("[-h | --help] Print help information");
  console.log(
    "[-R | --recursive] Completely delete the specified directory with all of its content."
  );
  console.log(
    "[-i | --include FILE_EXTENSIONS] Comma-separated list of file extensions to be included in the deletion."
  );
  console.log(
    "[-e | --include FILE_EXTENSIONS] Comma-separated list of file extensions to be excluded from the deletion."
  );
  console.groupEnd();
}
