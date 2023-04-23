import FeedbackGateway from "../../../core/ts/gateways/feedbackGateway";

export default class RestFeedbackGateway implements FeedbackGateway {
  public async sendFeedback(feedbackText: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
