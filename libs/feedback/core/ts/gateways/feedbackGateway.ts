export default interface FeedbackGateway {
  sendFeedback(feedbackText: string): Promise<void>;
}
