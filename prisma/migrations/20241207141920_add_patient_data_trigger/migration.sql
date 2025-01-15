-- CreateTrigger
CREATE OR REPLACE FUNCTION create_patient_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert medical-data record
    INSERT INTO "PatientData" (id, "patientId", data, "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid()::text, 
        NEW.id,
        '{"type": "medical-data", "data": {}}'::jsonb,
        NOW(),
        NOW()
    );

    -- Insert oral-check record
    INSERT INTO "PatientData" (id, "patientId", data, "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid()::text,
        NEW.id,
        '{"type": "oral-check", "data": {}}'::jsonb,
        NOW(),
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS patient_data_trigger ON "Patient";

-- Create trigger
CREATE TRIGGER patient_data_trigger
    AFTER INSERT ON "Patient"
    FOR EACH ROW
    EXECUTE FUNCTION create_patient_data(); 