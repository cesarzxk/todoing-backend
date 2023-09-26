import "reflect-metadata";
import { Entity, Column, PrimaryColumn, Generated, ManyToOne } from "typeorm";
import { dataSource } from "../data-source";
import { Schedulling } from "./scheduling";

interface editTagType {
  title?: string;
  id?: string;
}

interface createTagType extends editTagType {
  schedullingId?: string;
}

@Entity("tag")
export class Tag {
  @PrimaryColumn({ unique: true })
  @Generated("uuid")
  id: string;

  @Column("varchar")
  title: string;

  @ManyToOne(() => Schedulling, (schedulling) => schedulling.tags, {
    onDelete: "CASCADE",
  })
  schedulling: Schedulling;
}

export async function createTag(tagInfo: createTagType) {
  try {
    const schedulling = new Schedulling();
    schedulling.id = tagInfo.schedullingId;

    const tag = new Tag();
    tag.title = tagInfo.title;
    tag.schedulling = schedulling;

    const result = await dataSource.manager.save(tag);
    return { result, code: 200 };
  } catch {
    console.log("createTag exception!");
    return { result: "createTag exception!", code: 500 };
  }
}

export async function getTagsBySchedullingId(id: string) {
  try {
    const result = await dataSource
      .getRepository(Tag)
      .findBy({ schedulling: { id } });

    return { result, code: 200 };
  } catch {
    console.log("getTagsBySchedullingId exception!");
    return { result: "getTagsBySchedullingId exception!", code: 500 };
  }
}

export async function updateTagsById(tagInfo: editTagType[]) {
  try {
    const result = tagInfo.map(async ({ id, title }) => {
      return await dataSource.getRepository(Tag).update(id, { title });
    });

    return { result, code: 200 };
  } catch {
    console.log("deleteSchedullingBy exception!");
    return { result: "deleteSchedullingBy exception!", code: 500 };
  }
}

export async function deleteTagById(id: string) {
  try {
    const result = await dataSource.getRepository(Tag).delete({ id });

    return { result, code: 200 };
  } catch {
    console.log("deleteSchedullingBy exception!");
    return { result: "deleteSchedullingBy exception!", code: 500 };
  }
}
