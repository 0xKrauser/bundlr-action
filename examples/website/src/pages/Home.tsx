import { BundlrContext } from "../components/BundlrProvider";
import { useContext, useEffect, useState } from "react";
import Account from "../components/Account";
import BundlrModal from "../components/BundlrModal";

export default function Home() {
    const { ready } = useContext(BundlrContext);
    const [bundlrModal, setBundlrModal] = useState(false);

    useEffect(() => {
        if (!ready) {
            setBundlrModal(false);
        }
    }, [ready]);

    return (
        <div className="flex min-h-screen lg:items-center">
            <BundlrModal open={bundlrModal} onClose={() => setBundlrModal(false)} />
            <main
                className="h-full py-12 px-4 flex"
                style={{
                    minHeight: "60vh",
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="flex flex-col border-2 p-4 w-full max-w-[720px] min-h-[80vh] gap-2">
                    <h1 className="text-xl mb-6">bundlr-action</h1>
                    <p>A simple Github action to upload files, folders and static/SPA websites to Arweave through Bundlr.</p>
                    <p>You can top up your bundlr balance through this page, on limited EVM chains and currencies.</p>
                    <p className="mt-6">Repo: <a className="underline" target="_blank" href="https://github.com/0xKrauser/bundlr-action">github.com/0xKrauser/bundlr-action</a></p>
                    <p>Author: <a className="underline" href="https://twitter.com/0xkrauser" target="_blank">0xKrauser</a></p>
                    <Account
                        onBundlrOpen={() => setBundlrModal(true)}
                    />
                </div>
            </main>
        </div>
    );
}
