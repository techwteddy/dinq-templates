import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
	const { name, email, password } = await req.json();
	if (!name || !email || !password) {
		return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
	}
	const existingUser = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});
	if (existingUser) {
		return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
	}
	const hashed = await hash(password, 10);
	const user = await prisma.user.create({
		data: { name, email, password: hashed },
	});
	return new Response(JSON.stringify({ user: { id: user.id, email: user.email } }), { status: 201 });
}
