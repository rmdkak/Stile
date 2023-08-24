import { type Tables } from "types/supabase";

import { supabase } from "./supabaseClient";

const DATA_TABLE = "POST-BOOKMARKS"
// get
export const fetchPostBookmark = async ({ userId }: Pick<Tables<"POST-BOOKMARKS", "Row">, "userId">) => {
  if (userId == null) return;
  const { data } = await supabase.from(DATA_TABLE).select().eq("userId", userId);
  return data
};

// post
export const onBookmarkPostHandler = async ({ postId, userId }: Tables<"POST-BOOKMARKS", "Insert">) => {
  if (postId == null || userId == null) return;
  await supabase.from(DATA_TABLE).insert({ postId, userId }).select();
};

// delete
export const onBookmarkDeleteHandler = async ({ postId, userId }: Tables<"POST-BOOKMARKS", "Insert">) => {
  if (postId == null || userId == null) return;
  await supabase.from(DATA_TABLE).delete().eq("postId", postId).eq("userId", userId);
};