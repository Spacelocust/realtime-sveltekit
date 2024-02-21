const hash = await Bun.password.hash(Bun.argv[2]);

// eslint-disable-next-line no-console
console.log(hash);

process.exit(0);

export {};
