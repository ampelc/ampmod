const Ajv = require("ajv");
const ajv = new Ajv();

// Load Schemas
const sb2Defs = require("./sb2_definitions.json");
const sb3Defs = require("./sb3_definitions.json");
const sb2Schema = require("./sb2_schema.json");
const sb3Schema = require("./sb3_schema.json");
const sprite2Schema = require("./sprite2_schema.json");
const sprite3Schema = require("./sprite3_schema.json");

ajv.addSchema(sb2Defs).addSchema(sb3Defs);

/**
 * Internal validation logic to check against SB3 then SB2 schemas
 */
const validate = function (isSprite, input, callback) {
    const validateSb3 = ajv.compile(isSprite ? sprite3Schema : sb3Schema);
    const isValidSb3 = validateSb3(input);
    if (isValidSb3) {
        input.projectVersion = 3;
        return callback(null, input);
    }

    const validateSb2 = ajv.compile(isSprite ? sprite2Schema : sb2Schema);
    const isValidSb2 = validateSb2(input);
    if (isValidSb2) {
        input.projectVersion = 2;
        return callback(null, input);
    }

    // If both fail, return the error object
    const validationErrors = {
        validationError: "Could not parse as a valid SB2 or SB3 project.",
        sb3Errors: validateSb3.errors,
        sb2Errors: validateSb2.errors,
    };

    callback(validationErrors);
};

/**
 * Exported function with sb3fix recovery
 */
module.exports = function (isSprite, input, callback) {
    // 1. Attempt standard validation first
    validate(isSprite, input, function (err, result) {
        if (!err) {
            return callback(null, result);
        }

        // 2. Validation failed. Try to salvage via sb3fix
        try {
            // Lazy load for edge-case performance
            // eslint-disable-next-line global-require
            const sb3fix = require("@turbowarp/sb3fix");

            const fixed = sb3fix.fixJSON(input, {
                platform: "turbowarp",
            });

            // 3. Re-validate the "fixed" version
            validate(isSprite, fixed, function (err2, result2) {
                if (err2) {
                    // If even the fixed version fails, return the ORIGINAL error
                    return callback(err);
                }
                callback(null, result2);
            });
        } catch (sb3fixError) {
            // If sb3fix crashes or isn't found, return the original validation error
            callback(err);
        }
    });
};
