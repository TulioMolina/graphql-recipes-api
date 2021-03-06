import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";

import { Recipe } from "./recipe.entity";
import { CreateRecipeInput } from "./types/create-recipe-input.type";
import { User } from "../user/user.entity";
import { Category } from "../category/category.entity";
import { NameOrIdInput } from "../utils/types/name-or-id-input.type";
import { validateNameOrIdInput } from "../utils/validate-name-or-id-input";
import { FilterInput } from "./types/filter-input.type";

@Service()
@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  async findRecipe(
    recipeNameOrId: NameOrIdInput,
    userId?: number
  ): Promise<Recipe> {
    validateNameOrIdInput(recipeNameOrId, "Recipe");

    const { id, name } = recipeNameOrId;
    const query = this.createQueryBuilder("recipe");

    query.where("(recipe.id = :id OR recipe.name = :name)", { id, name });

    if (userId) {
      query.andWhere("recipe.userId = :userId", { userId });
    }

    const foundRecipe = await query.getOne();

    if (!foundRecipe) {
      throw new Error("Recipe not found");
    }

    return foundRecipe;
  }

  async getFilteredRecipes(filterInput: FilterInput): Promise<Recipe[]> {
    const {
      nameList,
      descriptionTerm,
      ingredient,
      categoryNameList,
    } = filterInput;

    const query = this.createQueryBuilder("recipe").innerJoin(
      "recipe.category",
      "category"
    );

    if (nameList && nameList.length > 0) {
      query.andWhere("recipe.name IN (:...nameList)", { nameList });
    }

    if (categoryNameList && categoryNameList.length > 0) {
      query.andWhere("category.name IN (:...categoryNameList)", {
        categoryNameList,
      });
    }

    if (descriptionTerm)
      query.andWhere("recipe.description LIKE :descriptionTerm", {
        descriptionTerm: `%${descriptionTerm}%`,
      });

    if (ingredient) {
      query.andWhere("recipe.ingredients LIKE :ingredient", {
        ingredient: `%${ingredient}%`,
      });
    }

    return await query.orderBy("recipe.id", "DESC").getMany();
  }

  async createRecipe(
    createRecipeInput: CreateRecipeInput,
    user: User,
    category: Category
  ): Promise<Recipe> {
    const recipe = this.create({
      ...createRecipeInput,
      category,
      user,
    });

    return await recipe.saveCheckingDuplicateName();
  }
}
