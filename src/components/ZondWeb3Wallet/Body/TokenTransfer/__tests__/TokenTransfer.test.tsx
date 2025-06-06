import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bytes } from "@theqrl/web3";
import { MemoryRouter } from "react-router-dom";
import TokenTransfer from "../TokenTransfer";

jest.mock("@theqrl/web3", () => {
  const originalModule =
    jest.requireActual<typeof import("@theqrl/web3")>("@theqrl/web3");
  return {
    ...originalModule,
    validator: { isAddressString: jest.fn(() => true) },
  };
});

describe("TokenTransfer", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TokenTransfer />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the account details component", () => {
    renderComponent();

    expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
      "Active account",
    );
    expect(screen.getByText("Account address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20B71 4091c F2a62 DADda 28478 03e3f 1B9D2 D3779"),
    ).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("0.0 ZND")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })[1]).toHaveTextContent(
      "Make a transaction",
    );
    expect(screen.getByText("Send to")).toBeInTheDocument();
    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    expect(receiverAddressField).toBeInTheDocument();
    expect(receiverAddressField).toBeEnabled();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    expect(amountField).toBeInTheDocument();
    expect(amountField).toBeEnabled();
    const mnemonicPhrasesField = screen.getByRole("textbox", {
      name: "mnemonicPhrases",
    });
    expect(mnemonicPhrasesField).toBeInTheDocument();
    expect(mnemonicPhrasesField).toBeEnabled();
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    const sendZondButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendZondButton).toBeInTheDocument();
    expect(sendZondButton).toBeDisabled();
  });

  it("should enable the send zond button once receiver address, amount and mnemonic phrases are entered", async () => {
    renderComponent();

    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    const mnemonicPhrasesField = screen.getByRole("textbox", {
      name: "mnemonicPhrases",
    });
    await waitFor(
      async () => {
        await userEvent.type(
          receiverAddressField,
          "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
        );
        await userEvent.type(amountField, "2.5");
        await userEvent.type(
          mnemonicPhrasesField,
          "knight paddy action glow play chew lame mature sock ill deadly olive blink marble breach mile hey mature tacit mean polo crawl khaya stud number speed viking windy jump subtle mildew sewage",
        );
      },
      { timeout: 5000 },
    );
    const sendZondButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendZondButton).toBeInTheDocument();
    expect(sendZondButton).toBeEnabled();
  });

  it("should display the error message if amount is not valid", async () => {
    renderComponent();

    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    await waitFor(async () => {
      await userEvent.type(amountField, "-2.5");
    });
    expect(
      screen.getByText("Amount should be more than 0"),
    ).toBeInTheDocument();
  });

  it("should display the error message if mnemonic phrases is empty", async () => {
    renderComponent();

    const mnemonicPhrasesField = screen.getByRole("textbox", {
      name: "mnemonicPhrases",
    });
    await waitFor(async () => {
      await userEvent.type(mnemonicPhrasesField, "0");
      await userEvent.keyboard("{Backspace}");
    });
    expect(
      screen.getByText("Menmonic phrases are required"),
    ).toBeInTheDocument();
  });

  it("should display the transaction successful component if the transaction succeeds", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          signAndSendNativeToken: async (
            from: string,
            to: string,
            value: number,
            mnemonicPhrases: string,
          ) => {
            from;
            to;
            value;
            mnemonicPhrases;
            return {
              transactionReceipt: {
                status: 1,
                transactionHash: "",
                transactionIndex: 1,
                blockHash: 2 as unknown as Bytes,
                blockNumber: 1,
                from: "",
                to: "",
                gasUsed: 0,
                cumulativeGasUsed: 0,
                logs: [],
                logsBloom: "",
                root: "",
              },
              error: "",
            };
          },
        },
      }),
    );

    const receiverAddressField = screen.getByRole("textbox", {
      name: "receiverAddress",
    });
    const amountField = screen.getByRole("spinbutton", { name: "amount" });
    const mnemonicPhrasesField = screen.getByRole("textbox", {
      name: "mnemonicPhrases",
    });
    await waitFor(async () => {
      await userEvent.type(
        receiverAddressField,
        "Z20fB08fF1f1376A14C055E9F56df80563E16722b",
      );
      await userEvent.type(amountField, "2.5");
      await userEvent.type(
        mnemonicPhrasesField,
        "knight paddy action glow play chew lame mature sock ill deadly olive blink marble breach mile hey mature tacit mean polo crawl khaya stud number speed viking windy jump subtle mildew sewage",
      );
    });
    const sendZondButton = screen.getByRole("button", {
      name: "Send ZND",
    });
    expect(sendZondButton).toBeInTheDocument();
    expect(sendZondButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(sendZondButton);
    });
    expect(screen.getByText("Transaction completed")).toBeInTheDocument();
  });
});
