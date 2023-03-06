import AppError from "./AppError.ts";

export default function (err: AppError) {
  if (err.error instanceof Deno.errors.NotFound) {
    console.warn(`No entry was found at this path: ${err.path}`);
    return;
  } else {
    console.log("Something went wrong. PowerDelete is exiting...");
  }

  Deno.exit(1);
}
