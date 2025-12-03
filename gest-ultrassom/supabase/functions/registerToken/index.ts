import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { perfilId, token } = await req.json();
    if (!perfilId || !token) return new Response("Bad Request", { status: 400 });

    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return new Response("Server Misconfig", { status: 500 });

    const supabase = createClient(url, key);
    const { error } = await supabase
      .from("fcm_tokens")
      .insert({ perfil_id: perfilId, token });
    if (error) return new Response(error.message, { status: 500 });
    return new Response("OK", { status: 200 });
  } catch (_) {
    return new Response("Error", { status: 500 });
  }
});
