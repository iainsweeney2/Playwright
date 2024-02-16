import { mergeExpects } from "@playwright/test";
import { expect as toBeValidDate } from "../Fixtures/toBeValidDate"
export { test } from "@playwright/test";

export const expect = mergeExpects(toBeValidDate);