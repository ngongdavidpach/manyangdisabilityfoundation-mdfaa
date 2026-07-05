import { defineMcp } from "@lovable.dev/mcp-js";
import getFoundationInfoTool from "./tools/get-foundation-info";
import listNewsTool from "./tools/list-news";

export default defineMcp({
  name: "manyang-foundation-mcp",
  title: "Manyang Disability Foundation",
  version: "0.1.0",
  instructions:
    "Tools for exploring public information about the Manyang Disability Foundation. Use `get_foundation_info` for mission/contact details and `list_news` to browse the latest news articles.",
  tools: [getFoundationInfoTool, listNewsTool],
});
