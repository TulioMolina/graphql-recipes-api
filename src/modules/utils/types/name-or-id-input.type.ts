import { InputType, Field, Int } from "type-graphql";
import { Length } from "class-validator";

@InputType({
  description:
    "Type for identifying an object by either name or id. Only one of the fields is accepted",
})
export class NameOrIdInput {
  @Field((type) => Int, {
    nullable: true,
  })
  id?: number;

  @Field((type) => String, {
    nullable: true,
  })
  @Length(2, 255)
  name?: string;
}
