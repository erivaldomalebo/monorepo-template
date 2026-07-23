import { db } from "../src/shared/infra/database";

async function main() {
	console.log("Seeding database...");
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
