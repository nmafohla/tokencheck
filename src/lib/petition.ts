import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { petitionOpen } from "@/lib/closes";
import { getSql } from "@/lib/db";

export const getPetitionCount = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ count: number }>`
    select count(*)::int as count from petition_support
  `;
  return { count: rows[0]?.count ?? 0 };
});

export const signPetition = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.uuid() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!petitionOpen()) {
      const rows = await sql<{ count: number }>`
        select count(*)::int as count from petition_support
      `;
      return { count: rows[0]?.count ?? 0, closed: true };
    }
    await sql`
      insert into petition_support (id)
      values (${data.id})
      on conflict (id) do nothing
    `;
    const rows = await sql<{ count: number }>`
      select count(*)::int as count from petition_support
    `;
    return { count: rows[0]?.count ?? 0, closed: false };
  });
