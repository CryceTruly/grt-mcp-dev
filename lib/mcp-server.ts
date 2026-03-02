import { baseURL } from "@/baseUrl";
import { findStoresAndCoupons } from "@/lib/promocodes-data";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

export const mcpHandler = createMcpHandler(
  async (server) => {
    const html = await getAppsSdkCompatibleHtml(baseURL, "/");

    const contentWidget: ContentWidget = {
      id: "show_content",
      title: "Show Content",
      templateUri: "ui://widget/content-template.html",
      invoking: "Loading content...",
      invoked: "Content loaded",
      html,
      description: "Displays the homepage content",
      widgetDomain: "https://nextjs.org/docs",
    };

    server.registerResource(
      "content-widget",
      contentWidget.templateUri,
      {
        title: contentWidget.title,
        description: contentWidget.description,
        mimeType: "text/html+skybridge",
        _meta: {
          "openai/widgetDescription": contentWidget.description,
          "openai/widgetPrefersBorder": true,
        },
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: `<!DOCTYPE html>${contentWidget.html}`,
            _meta: {
              "openai/widgetDescription": contentWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": contentWidget.widgetDomain,
            },
          },
        ],
      })
    );

    const inputSchema = {
      name: z
        .string()
        .describe(
          "The name of the user to display on the homepage"
        ),
    };

    // @ts-expect-error - MCP SDK registerTool has deep generic inference with zod
    server.registerTool(
      contentWidget.id,
      {
        title: contentWidget.title,
        description:
          "Fetch and display the homepage content with the name of the user",
        inputSchema,
        _meta: widgetMeta(contentWidget),
      },
      async (args) => {
        const name = (args as { name: string }).name;
        return {
          content: [{ type: "text", text: name }],
          structuredContent: {
            name,
            timestamp: new Date().toISOString(),
          },
          _meta: widgetMeta(contentWidget),
        };
      }
    );

    // ——— Promocodes.com: coupons widget ———
    const couponsHtml = await getAppsSdkCompatibleHtml(baseURL, "/coupons");
    const couponsWidget: ContentWidget = {
      id: "get_coupons",
      title: "Get store coupons",
      templateUri: "ui://widget/coupons-template.html",
      invoking: "Loading coupons...",
      invoked: "Coupons loaded",
      html: couponsHtml,
      description: "Shows coupons for a store (e.g. Dell, Amazon). Each coupon has an Open offer button.",
      widgetDomain: "https://promocodes.com",
    };

    server.registerResource(
      "coupons-widget",
      couponsWidget.templateUri,
      {
        title: couponsWidget.title,
        description: couponsWidget.description,
        mimeType: "text/html+skybridge",
        _meta: {
          "openai/widgetDescription": couponsWidget.description,
          "openai/widgetPrefersBorder": true,
        },
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: `<!DOCTYPE html>${couponsWidget.html}`,
            _meta: {
              "openai/widgetDescription": couponsWidget.description,
              "openai/widgetPrefersBorder": true,
              "openai/widgetDomain": couponsWidget.widgetDomain,
            },
          },
        ],
      })
    );

    const couponsInputSchema = {
      store: z
        .string()
        .describe("Store name to get coupons for (e.g. dell, amazon, best buy, nike)"),
    };

    server.registerTool(
      couponsWidget.id,
      {
        title: couponsWidget.title,
        description:
          "Get coupons and deals for a store. Use when the user asks for coupons (e.g. 'Dell coupons', 'Amazon coupons').",
        inputSchema: couponsInputSchema,
        _meta: widgetMeta(couponsWidget),
      },
      async (args) => {
        const storeQuery = (args as { store: string }).store;
        const result = findStoresAndCoupons(storeQuery);
        if (!result) {
          return {
            content: [
              {
                type: "text",
                text: `No store found for "${storeQuery}". Try: dell, amazon, best buy, nike.`,
              },
            ],
            _meta: widgetMeta(couponsWidget),
          };
        }
        const { store, coupons } = result;
        return {
          content: [
            {
              type: "text",
              text: `${store.name}: ${coupons.length} coupon(s) found.`,
            },
          ],
          structuredContent: { store, coupons },
          _meta: widgetMeta(couponsWidget),
        };
      }
    );
  },
  {},
  {
    streamableHttpEndpoint: "/mcp",
    sseEndpoint: "/sse",
    disableSse: true, // SSE transport requires Redis; GET /mcp returns minimal SSE for connector validation only
  }
);
