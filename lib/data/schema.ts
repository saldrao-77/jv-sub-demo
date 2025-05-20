import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getTableColumns(tableName: string): Promise<string[]> {
  const supabase = createServerSupabaseClient()

  try {
    // First try using RPC if it exists
    const { data: columns, error } = await supabase.rpc("get_table_columns", { table_name: tableName })

    if (!error && columns) {
      return columns.map((col: any) => col.column_name)
    }

    // If RPC fails, try a direct query to information_schema
    const { data: schemaData, error: schemaError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", tableName)
      .eq("table_schema", "public")

    if (!schemaError && schemaData) {
      return schemaData.map((col: any) => col.column_name)
    }

    // If both methods fail, return an empty array
    console.error("Could not determine table columns:", error || schemaError)
    return []
  } catch (error) {
    console.error("Error getting table columns:", error)
    return []
  }
}
