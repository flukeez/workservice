import db from "@/database";
import { IRequestForm } from "@/types/Request";

export class RequestModel {
  async create(data: IRequestForm): Promise<{ result: number }> {
    return { result: 1 };
  }
}
