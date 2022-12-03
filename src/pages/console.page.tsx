/**
 * AlgoRealm
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Container } from "@mui/material";
import PageHeader from "@/components/Headers/PageHeader";
import { useEffect, useMemo, useState } from "react";
import Terminal from "react-console-emulator";
import { PeraWalletConnect } from "@perawallet/connect";
import { ellipseAddress } from "@/utils/ellipseAddress";
import { useSnackbar } from "notistack";
import { indexerForChain } from "@/utils/algorand";
import { ChainType } from "@/models/Chain";

const ALGOREALM_APP_ID = 137491307;
const ALGOREALM_FIRST_BLOCK = 13578170;

const peraWallet = new PeraWalletConnect();

const Console = () => {
    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const isConnectedToPeraWallet = useMemo(() => {
        return !!accountAddress;
    }, [accountAddress]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const searchAlgoRealmCalls = async () => {
        let token = "";
        let numtxn = 1;
        let calls = [];

        while (numtxn > 0) {
            const result = await indexerForChain(ChainType.MainNet)
                .searchForTransactions()
                .limit(1000)
                .nextToken(token)
                .applicationID(ALGOREALM_APP_ID)
                .minRound(ALGOREALM_FIRST_BLOCK)
                .do();
            calls.push(...result.transactions);
            numtxn = result.transactions.length;
            if (numtxn > 0) {
                token = result["next-token"];
            }
        }

        return calls;
    };

    const history = async () => {
        const attempts = 1;
        let algorealmCalls = [];
        let claims_history = [];
        while (attempts <= 5) {
            try {
                algorealmCalls = await searchAlgoRealmCalls();
                break;
            } catch (e) {
                console.log(e);
            }
        }

        for (const call of algorealmCalls) {
            const callArgs =
                call["application-transaction"]["application-args"];

            if (callArgs.length === 2) {
                const block = call["confirmed-round"];
                const nft = Buffer.from(callArgs[0], "base64").toString();
                let name = "";
                const donation = call["global-state-delta"][0]["value"]["uint"];
                if (call["global-state-delta"].length === 2) {
                    name = Buffer.from(
                        call["global-state-delta"][1]["value"]["bytes"],
                        "base64"
                    ).toString();
                }

                if (nft === "Crown") {
                    claims_history.push(
                        `\n👑 ${name} claimed the Crown of Entropy \n
                        on Block: ${block} donating: ${donation / 1e6} Algos \
                        to the Rewards Pool.\n\n`
                    );
                }
                if (nft === "Sceptre") {
                    claims_history.push(
                        `\n🔮 ${name} claimed the Sceptre of Proof \n
                        on Block: ${block} donating: ${donation / 1e6} Algos \
                        to the Rewards Pool.\n\n`
                    );
                }
            }
        }

        return claims_history.join("\n");
    };

    const commands = {
        about: {
            description: "About AlgoRealm",
            fn: () => {
                return "AlgoRealm UI is an open source app built for the AlgoRealm CLI game originally created by @cusma. AlgoRealm UI is available under GPLv3 license. Developed by @aorumbayev. CLI commands are identical to the original commands in the AlgoRealm documentation. For more details refer to https://github.com/cusma/algorealm.";
            },
        },
        dynasty: {
            description: "Print entire AlgoRealm dynasty",
            fn: async () => {
                return await history();
            },
        },
        poem: {
            description: "Prints a poem.",
            fn: () => {
                return "poem test";
            },
        },
        login: {
            description: "Login to PeraWallet | Print login status",
            fn: () => {
                if (isConnectedToPeraWallet) {
                    return `You are already connected to PeraWallet: ${ellipseAddress(
                        accountAddress,
                        4
                    )}`;
                }
                handleConnectWalletClick();
            },
        },
        logout: {
            description: "Logout from PeraWallet",
            fn: () => {
                if (!isConnectedToPeraWallet) {
                    return `You are already logged out: ${ellipseAddress(
                        accountAddress,
                        4
                    )}`;
                }
                handleDisconnectWalletClick();
            },
        },
    };

    const handleConnectWalletClick = () => {
        peraWallet
            .connect()
            .then((newAccounts) => {
                if (peraWallet.connector) {
                    peraWallet.connector.on(
                        "disconnect",
                        handleDisconnectWalletClick
                    );
                }

                setAccountAddress(newAccounts[0]);
                enqueueSnackbar(
                    `Connected to PeraWallet: ${ellipseAddress(
                        newAccounts[0],
                        4
                    )}`,
                    {
                        variant: "success",
                    }
                );
            })
            .catch((error) => {
                if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                    console.log(error);
                }
            });
    };

    const handleDisconnectWalletClick = () => {
        peraWallet.disconnect().catch((error) => {
            console.log(error);
        });
        enqueueSnackbar(
            `Disconnected from PeraWallet: ${ellipseAddress(
                accountAddress,
                4
            )}`,
            {
                variant: "success",
            }
        );
        setAccountAddress(null);
    };

    const customPromptLabel = useMemo(() => {
        return isConnectedToPeraWallet
            ? `(${ellipseAddress(accountAddress, 4)})$➜`
            : "➜";
    }, []);

    useEffect(() => {
        // Reconnect to the session when the component is mounted
        peraWallet
            .reconnectSession()
            .then((accounts) => {
                if (peraWallet.connector) {
                    peraWallet.connector.on(
                        "disconnect",
                        handleDisconnectWalletClick
                    );
                }

                if (accounts.length) {
                    setAccountAddress(accounts[0]);
                }
            })
            .catch((e) => console.log(e));
    }, []);

    return (
        <div>
            <PageHeader
                title="🏰 AlgoRealm 👑"
                description="Claim the Crown and the Sceptre of Algorand Realm (cli emulator edition)"
            />

            <Container component="main" sx={{ pt: 10 }}>
                <Terminal
                    style={{
                        backgroundColor: "#222222",
                    }} // Terminal background
                    contentStyle={{ color: "#35f200" }} // Text colour
                    promptLabelStyle={{ color: "#FFFFFF" }} // Prompt label colour
                    inputTextStyle={{ color: "white" }} // Prompt text colour
                    commands={commands}
                    styleEchoBack="fullInherit" // Inherit echo styling from prompt1
                    welcomeMessage={"Welcome to the AlgoRealm v0.1.0 👑"}
                    promptLabel={customPromptLabel}
                />
            </Container>
        </div>
    );
};

export default Console;
