"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fee_dto_1 = require("./create-fee.dto");
class UpdateFeeDto extends (0, mapped_types_1.PartialType)(create_fee_dto_1.CreateFeeDto) {
}
exports.UpdateFeeDto = UpdateFeeDto;
//# sourceMappingURL=update-fee.dto.js.map