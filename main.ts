import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";
import AppError from "./AppError.ts";
import error_handler from "./error_handler.ts";

import K from "./K.ts";

const args = parse(Deno.args);
let path = Deno.cwd();

if (args._.length && typeof args._[0] === "string") {
  path = await Deno.realPath(args._[0]);
}

console.log(path);
console.log(args);
print_help();

try {
  const specified_path_info = await Deno.stat(path);

  if (specified_path_info.isFile) {
    console.log("Deleting the file...");
    await Deno.remove(path);
    console.log(`Successfully deleted this file: ${path}`);
  } else if (specified_path_info.isDirectory) {
    const dir_content: string[] = [];
    for await (const dir_entry of Deno.readDir(path)) {
      dir_content.push(dir_entry.name);
    }

    if (!dir_content.length) {
      console.log("Deleting the directory because it's empty...");
      await Deno.remove(path);
      console.log(`Successfully deleted this directory: ${path}`);
      Deno.exit(0);
    }

    // const removable_content = dir_content.map((current_entry) => {
    //   const current_entry_ext = current_entry.split(".");
    // });
  }
} catch (err) {
  error_handler(new AppError(err, path));
}

function print_help() {
  console.log(`
  PowerDelete ${K.VERSION}

  USAGE:
      pd [PATH] [OPTIONS]

  PATH:
      -> The path to the entry where delete operations will happen.
      -> If the provided path is pointing to a file, then that
         file will be automatically deleted.
      -> if the provided path is pointing to a directory:
          -> That directory will be deleted if it's empty.
          -> If it's not empty, then, you need to pick some options
             from the list bellow to customize the deletion.
      -> The path defaults to the current working directory if nothing
         was provided.
  
  OPTIONS:
      [-h | --help]         Print this message.
      [-R | --recursive]    Completely delete the specified directory
                            with all of its content. Will only work if
                            no other flag is provided.
      [-i | --include]      Comma-separated list of file extensions
                            to be included in the deletion. (png,mp4...)
                            Only the files ending with the provided
                            extensions will be deleted.
      [-e | --exclude]      Comma-separated list of file extensions
                            to be excluded from the deletion. (png,mp4...)
      [--keep]              Comma-separated list of file or directory names
                            to be exclusively kept from deletion.
      [--remove]            Comma-separated list of file or directory names
                            to be exclusively included in the deletion.
  `);
}

function get_extensions(param: string): string[] {
  return param.split(",");
}
