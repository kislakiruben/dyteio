import { Session } from "@supabase/supabase-js";
import { atom, DefaultValue } from "recoil";

import supabase from "../supabaseClient";

export const sessionState = atom({
  key: "atoms/auth/session",
  default: null as null | Session,
  effects: [
    ({ setSelf, onSet, trigger }) => {
      if (trigger === "get") {
        setSelf(
          supabase.auth.getSession().then(({ data, error }) => {
            return data ? data.session : new DefaultValue();
          })
        );
      }
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          setSelf(null);
        } else if (
          (event === "SIGNED_IN" ||
            event === "TOKEN_REFRESHED" ||
            event === "USER_UPDATED") &&
          session !== null
        ) {
          setSelf(session);
        }
      });
    },
  ],
});
