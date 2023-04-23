import InvalidRequestError from "qnect-sdk-web/lib/common/core/ts/errors/invalidRequestError";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";
import FeedbackGateway from "./feedbackGateway";

export default class FeedbackGatewayMock implements FeedbackGateway {
  public async sendFeedback(feedbackText: string): Promise<void> {
    console.debug("Feedback:", feedbackText);
    await JsExtension.delay(400);

    if (JsExtension.isBlank(feedbackText)) {
      throw new InvalidRequestError("Feedback text must not be empty.");
    }
  }
}
