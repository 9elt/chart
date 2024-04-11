const build = await Bun.build({
    entrypoints: ["index.ts"],
    outdir: ".",
    minify: false,
});

if (!build.success) {
    console.error(build);
    process.exit(1);
}
