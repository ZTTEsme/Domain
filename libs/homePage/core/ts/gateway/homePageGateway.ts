import AxiosRestClientProvider from "qnect-sdk-web/lib/auth/rest/ts/axiosRestClientProvider";

export default class HomePageGateway{

  private readonly clientProvider: AxiosRestClientProvider;

  public constructor(clientProvider: AxiosRestClientProvider) {
    this.clientProvider = clientProvider;
  }
}
