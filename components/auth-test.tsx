"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function AuthTest() {
    const [status, setStatus] = useState("Testing...");

    useEffect(() => {
        const test = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.auth.getUser();

                if (error) {
                    setStatus(`Auth Error: ${error.message}`);
                } else if (data.user) {
                    setStatus(`Authenticated as: ${data.user.email}`);
                } else {
                    setStatus("Not authenticated");
                }
            } catch (err) {
                setStatus(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        };

        test();
    }, []);

    return (
        <div className="p-4 border rounded bg-muted">
            <h3 className="font-semibold">Auth Status:</h3>
            <p className="text-sm">{status}</p>
        </div>
    );
}
