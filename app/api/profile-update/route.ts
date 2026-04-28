import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string; // ✅ dynamic email
    const image = formData.get("image") as File | null;

    if (!email) {
      return NextResponse.json({ error: "Email is required" });
    }

    let imageUrl: string | null = null;

    // 📸 Upload Image (if exists)
    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, image);

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message });
      }

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    //  Dynamic update object (avoid overwriting)
    const updateData: any = {};

    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl;

    // ❗ nothing to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No data to update" });
    }

    //  Update user
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("email", email)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    // user not found
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "User not found" });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data,
    });
  } catch (err) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}