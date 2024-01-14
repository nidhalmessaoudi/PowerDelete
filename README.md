# PowerDelete
PowerDelete is a simple command-line tool for intelligent file/dir deletions.
### Installation
Visit <a href="https://github.com/nidhalmessaoudi/PowerDelete/releases">the releases page</a> to download the latest version of PowerDelete specific to your operating system.
### Usage
For UNIX-based systems:
```
pd [path] [options]
```
For Windows:
```
./pd.exe [path] [options]
```
You can also add the executable folder to your PATH variable to use the tool everywhere in your system just by the `pd` command.
## Examples
```
pd /my_directory --include png,pdf,jpeg --keep my_best_img.png
```
This command will delete every file ending with `.png`, `.pdf`, or `.jpeg` in the `my_directory/` folder, but will keep the `my_best_img.png` file exclusively.
### Path
Notes about the path:
- The path is the pointer to the entry where delete operations will happen.
- If the provided path is pointing to a file, then that file will be automatically deleted.
- If the provided path is pointing to a directory:
  - That directory will be deleted if it's empty.
  - If it's not empty, you need to pick some options from the list below to customize the deletion.
- The path defaults to the current working directory if nothing was provided.
### Options
- `[-h | --help]` Print the help message.
- `[-R | --recursive]` Completely delete the specified directory with all of its content. It will only work if no other flag is provided.
- `[-i | --include]` Comma-separated list of file extensions to be included in the deletion. (png,mp4...) Only the files ending with the provided extensions will be deleted.
- `[-e | --exclude]` Comma-separated list of file extensions to be excluded from the deletion. (png,mp4...)
- `[--keep]` Comma-separated list of file or directory names to be exclusively kept from deletion.
- `[--remove]` Comma-separated list of file or directory names to be exclusively included in the deletion.
