-- This is an empty migration.

-- Lowercase existing filters for all patients
UPDATE "Patient"
SET "filters" = jsonb_build_array(
  LOWER(("filters"->0)::text),
  LOWER(("filters"->1)::text),
  LOWER(("filters"->2)::text),
  ("filters"->3)::text,
  LOWER(("filters"->4)::text),
  LOWER(("filters"->5)::text)
)
WHERE TRUE;

-- Create function to update filters
CREATE OR REPLACE FUNCTION update_patient_filters()
RETURNS TRIGGER AS $$
BEGIN
  NEW."filters" = jsonb_build_array(
    LOWER(NEW."firstName"),
    LOWER(NEW."lastName"),
    LOWER(NEW."email"),
    regexp_replace(COALESCE(NEW."phone", ''), '\s', '', 'g'),
    LOWER(NEW."city"),
    LOWER(NEW."county")
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update filters on insert or update
CREATE TRIGGER update_patient_filters_trigger
BEFORE INSERT OR UPDATE ON "Patient"
FOR EACH ROW
EXECUTE FUNCTION update_patient_filters();