import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";

import AppError from "./AppError.ts";
import error_handler from "./error_handler.ts";

import K from "./K.ts";

const args = parse(Deno.args);

if (args["h"] || args["help"]) {
  print_help();
  Deno.exit(0);
}

let path = Deno.cwd();
const slashType = path.includes("/") ? "/" : "\\";

try {
  if (args._.length && typeof args._[0] === "string") {
    path = args._[0];
    path = await Deno.realPath(args._[0]);
  }

  let deleteAll = false;

  if (args["R"]) {
    const argFlags = Object.keys(args);
    argFlags.splice(argFlags.indexOf("_"), 1);
    argFlags.splice(argFlags.indexOf("R"), 1);

    if (!argFlags.length) {
      deleteAll = true;
    }
  }

  const specified_path_info = await Deno.stat(path);
  const dir_content: string[] = [];

  if (specified_path_info.isFile) {
    deleteAll = true;
  } else if (specified_path_info.isDirectory) {
    for await (const dir_entry of Deno.readDir(path)) {
      dir_content.push(dir_entry.name);
    }

    if (!dir_content.length) {
      deleteAll = true;
    }
  }

  if (deleteAll) {
    console.log("Deleting the specified path...");
    await Deno.remove(path, { recursive: true });
    console.log(`Successfully deleted ${path}`);
    Deno.exit(0);
  }

  let nothingToDelete = true;

  const removable_file_extensions: Set<string> = new Set();
  const stayable_file_extensions: Set<string> = new Set();
  const files_to_keep: Set<string> = new Set();
  const files_to_remove: Set<string> = new Set();

  const flags = [
    ["i", removable_file_extensions],
    ["include", removable_file_extensions],
    ["e", stayable_file_extensions],
    ["exclude", stayable_file_extensions],
    ["keep", files_to_keep],
    ["remove", files_to_remove],
  ];

  flags.forEach((flag) => {
    const flag_key = args[flag[0] as string];

    if (flag_key) {
      const flag_set = flag[1] as Set<string>;
      get_values(flag_key).forEach((val) => flag_set.add(val));
    }
  });

  files_to_keep.forEach((entry) => {
    if (files_to_remove.has(entry)) {
      files_to_remove.delete(entry);
    }
  });

  stayable_file_extensions.forEach((ext) => {
    dir_content.forEach((entry) => {
      if (entry.endsWith(ext)) {
        files_to_keep.add(entry);
      }
    });
  });

  removable_file_extensions.forEach((ext) => {
    dir_content.forEach((entry) => {
      if (entry.endsWith(ext) && !files_to_keep.has(entry)) {
        files_to_remove.add(entry);
      }
    });
  });

  for (const entry of files_to_remove) {
    const entry_path = `${path}${
      path.endsWith(slashType) ? "" : slashType
    }${entry}`;

    console.log(`Deleting ${entry_path}`);

    await Deno.remove(entry_path, {
      recursive: true,
    });

    console.log(`${entry} was deleted successfully.`);

    if (nothingToDelete) {
      nothingToDelete = false;
    }
  }

  if (nothingToDelete) {
    console.log(
      "No entry was deleted! Please use the '--help' flag to see how you can customize the delete operation."
    );
  } else {
    console.log("All the specified entries was successfully deleted!");
  }

  Deno.exit(0);
} catch (err) {
  error_handler(new AppError(err, path));
}

function get_values(param: string): string[] {
  return param.split(",");
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
