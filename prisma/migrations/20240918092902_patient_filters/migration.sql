-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "filters" JSONB NOT NULL DEFAULT '[]';

-- Update existing patients with default filter values
UPDATE "Patient"
SET "filters" = jsonb_build_array(
  "firstName",
  "lastName",
  "email",
  regexp_replace(COALESCE("phone", ''), '\s', '', 'g'),
  "city",
  "county"
)
WHERE TRUE;

-- Create function to update filters
CREATE OR REPLACE FUNCTION update_patient_filters()
RETURNS TRIGGER AS $$
BEGIN
  NEW.filters = jsonb_build_array(
    NEW.firstName,
    NEW.lastName,
    NEW.email,
    regexp_replace(COALESCE(NEW.phone, ''), '\s', '', 'g'),
    NEW.city,
    NEW.county
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for insert and update
CREATE OR REPLACE TRIGGER patient_filters_trigger
BEFORE INSERT OR UPDATE ON "Patient"
FOR EACH ROW
EXECUTE FUNCTION update_patient_filters();

