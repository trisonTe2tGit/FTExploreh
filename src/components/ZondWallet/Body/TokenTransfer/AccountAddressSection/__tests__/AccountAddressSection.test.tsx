import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccountAddressSection from "../AccountAddressSection";

describe("AccountAddressSection", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AccountAddressSection />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the account address section component", () => {
    renderComponent();

    expect(screen.getByText("Account address")).toBeInTheDocument();
    expect(
      screen.getByText("0x 2090E 9F387 71876 FB6Fc 51a6b 46412 1d3cC 093A1"),
    ).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("0 QRL")).toBeInTheDocument();
  });
});
