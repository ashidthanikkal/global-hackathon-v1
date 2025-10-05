import { Controller, Post, Body } from "@nestjs/common";
import { GraphService } from "./graph.service";

@Controller("graph")
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post("generate")
  async generateGraph(@Body() body: { text: string }) {
    return this.graphService.generateGraph(body.text);
  }
}
