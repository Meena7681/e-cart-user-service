import mongoose from "mongoose";

type CategoryModel = {
  name: string;
  nameTranslations: string;
  parentId: string;
  subCategories: CategoryDoc[];
  products: string[];
  displayOrder: number; //100 -1
  imageUrl: string;
};

export type CategoryDoc = mongoose.Document & CategoryModel;

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    nameTranslation: { en: { type: String }, de: { type: String } },
    parentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "categories",
    },
    subCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "categories",
      },
    ],
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "products",
      },
    ],
    displayOrder: { type: Number, default: 1 },
    imageUrl: String,
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret.createAt;
        delete ret.updateAt;
      },
    },
    timestamps: true,
  }
);

const categories =
  mongoose.models.categories ||
  mongoose.model<CategoryDoc>("categories", CategorySchema);

export { categories };
