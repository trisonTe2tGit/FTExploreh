import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZondWeb3Wallet from "../ZondWeb3Wallet";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getDAppRequestData: jest.fn(async () => ({
      method: "zond_requestAccounts",
      requestData: {
        senderData: {
          tabId: 1,
          title: "Mocked Page Title",
          url: "http://localhost/",
          favIconUrl: "http://localhost/mocked-fav-icon.svg",
        },
      },
    })),
  };
});
jest.mock("@/components/ZondWeb3Wallet/Header/Header", () => () => (
  <div>Mocked Header</div>
));
jest.mock("@/components/ZondWeb3Wallet/Body/Body", () => () => (
  <div>Mocked Body</div>
));
jest.mock("@/components/ZondWeb3Wallet/RouteMonitor/RouteMonitor", () => () => (
  <div>Mocked Route Monitor</div>
));
jest.mock("../DAppRequest/DAppRequest", () => () => (
  <div>Mocked DApp Request</div>
));

describe("ZondWeb3Wallet", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ZondWeb3Wallet />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the route monitor, the header component and the body component", async () => {
    renderComponent();

    await act(async () => {
      expect(screen.getByText("Mocked Route Monitor")).toBeInTheDocument();
      expect(screen.getByText("Mocked DApp Request")).toBeInTheDocument();
    });
  });
});
