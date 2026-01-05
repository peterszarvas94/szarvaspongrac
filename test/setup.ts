import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { getTestCredentials } from "./helpers";

function getPocketbaseBinary(): string {
  const projectRoot = path.resolve(__dirname, "..");
  const linuxBinary = path.join(projectRoot, "pb", "pocketbase_linux_amd64");
  const macBinary = path.join(projectRoot, "pb", "pocketbase_mac_arm64");

  if (process.platform === "darwin" && existsSync(macBinary)) {
    return macBinary;
  }
  if (existsSync(linuxBinary)) {
    return linuxBinary;
  }
  throw new Error("No pocketbase binary found");
}

export function setup(): void {
  const { email, password } = getTestCredentials();
  const pbBinary = getPocketbaseBinary();
  const projectRoot = path.resolve(__dirname, "..");
  const pbDataDir = path.join(projectRoot, "pb", "pb_data");

  try {
    execSync(
      `"${pbBinary}" superuser upsert ${email} ${password} --dir="${pbDataDir}"`,
      { stdio: "pipe" },
    );
    console.log(`Test superuser "${email}" is ready`);
  } catch (error) {
    console.error("Failed to create test superuser:", error);
    throw error;
  }
}
