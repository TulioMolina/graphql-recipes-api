import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

import { NameOrIdInput } from "../../utils/types/name-or-id-input.type";

@InputType({
  description: "Type for defining and validating Recipe update input data",
})
export class UpdateRecipeInput {
  @Field((type) => NameOrIdInput)
  targetRecipeNameOrId: NameOrIdInput;

  @Field({ nullable: true })
  @Length(2, 255)
  name?: string;

  @Field({ nullable: true })
  @Length(5, 255)
  description?: string;

  @Field({ nullable: true })
  @Length(5, 255)
  ingredients?: string;

  @Field((type) => NameOrIdInput, { nullable: true })
  categoryNameOrId: NameOrIdInput;
}
