import "reflect-metadata";
import { Entity, Column, PrimaryColumn, Generated, OneToMany } from "typeorm";
import { dataSource } from "../data-source";
import { Tag, createTag } from "./tag";

interface schedullingTypes {
  description?: string;
  title?: string;
  duration?: Date;
  time?: Date;
  tags?: string[];
}

@Entity("schedulling")
export class Schedulling {
  @PrimaryColumn({ unique: true })
  @Generated("uuid")
  id: string;

  @Column("varchar")
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @Column({ type: "datetime" })
  time: Date;

  @Column({ type: "datetime" })
  duration: Date;

  @OneToMany(() => Tag, (tag) => tag.schedulling)
  tags: Tag[];
}

export async function createSchedulling({
  description,
  duration,
  time,
  title,
  tags,
}: schedullingTypes) {
  try {
    const skedulling = new Schedulling();
    skedulling.description = description;
    skedulling.duration = duration;
    skedulling.time = time;
    skedulling.title = title;
    let result = await dataSource.manager.save(skedulling);

    if (tags && tags.length > 0) {
      tags.map(
        async (tag) => await createTag({ schedullingId: result.id, title: tag })
      );
    }

    return { result, code: 200 };
  } catch {
    console.log("createSchedulling exception!");
    return { result: "createSchedulling exception!", code: 500 };
  }
}

export async function getAllSchedulling({ tags }: { tags?: string[] }) {
  try {
    let result = undefined;

    if (tags) {
      result = await dataSource
        .getRepository(Schedulling)
        .createQueryBuilder("schedulling")
        .leftJoinAndSelect("schedulling.tags", "tag")
        .where("tag.title IN (:...tags)", { tags })
        .getMany();
    } else {
      result = await dataSource.getRepository(Schedulling).find({});
    }

    return { result, code: 200 };
  } catch (e: any) {
    console.log("getAllSchedulling exception!");
    return { result: "createSchedulling exception!", code: 500 };
  }
}

export async function getSchedullingById(id: string) {
  try {
    const result = await dataSource.getRepository(Schedulling).findBy({ id });

    return { result, code: 200 };
  } catch {
    console.log("getSchedullingById exception!");
    return { result: "getSchedullingById exception!", code: 500 };
  }
}

interface editableSchedullingTypes {
  description?: string;
  title?: string;
  duration?: Date;
  time?: Date;
}

export async function updateSchedullingById(
  id: string,
  schedullingInfo: editableSchedullingTypes
) {
  try {
    const result = await dataSource
      .getRepository(Schedulling)
      .update(id, schedullingInfo);

    return { result, code: 200 };
  } catch {
    console.log("updateSchedullingById exception!");
    return { result: "updateSchedullingById exception!", code: 500 };
  }
}

export async function deleteSchedullingBy(id: string) {
  try {
    const result = await dataSource
      .getRepository(Schedulling)
      .createQueryBuilder("schedulling")
      .delete()
      .where("id = :id", { id })
      .execute();

    return { result, code: 200 };
  } catch (e) {
    console.log("deleteSchedullingBy exception!");
    console.log(e);
    return { result: "deleteSchedullingBy exception!", code: 500 };
  }
}
