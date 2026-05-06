"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMajorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_major_dto_1 = require("./create-major.dto");
class UpdateMajorDto extends (0, mapped_types_1.PartialType)(create_major_dto_1.CreateMajorDto) {
}
exports.UpdateMajorDto = UpdateMajorDto;
//# sourceMappingURL=update-major.dto.js.map