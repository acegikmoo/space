import { exec } from "child_process";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.join(__dirname, "../../../code");

// basic sanitizer for shell metachars
const sanitize = (input: string): string => input.replace(/[;&|`$<>\\]/g, "");

export const executeCommand = (req: Request, res: Response) => {
	const { command } = req.body;

	if (!command || typeof command !== "string") {
		res.status(400).send({ message: "Invalid command" });
		return;
	}

	const safe = sanitize(command);

	// killswitch after 10s
	exec(
		`cd ${absolutePath} && ${safe}`,
		{ timeout: 10000 },
		(err, stdout, stderr) => {
			if (err) {
				res
					.status(200)
					.send({ message: "Command error", data: stderr || err.message });
			} else {
				res.status(200).send({ message: "Command executed", data: stdout });
			}
		},
	);
};
