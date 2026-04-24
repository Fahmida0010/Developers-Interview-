import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server only
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const image = formData.get("image") as File;

    let imageUrl = "";

    // 📸 image upload to supabase storage
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { data, error } = await supabase.storage
        .from("avatars") // 👉 bucket name
        .upload(fileName, image);

      if (error) {
        return NextResponse.json({ error: error.message });
      }

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    // 🔥 user update (table name: users)
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: name,
        image: imageUrl,
      })
      .eq("email", "YOUR_USER_EMAIL"); // ⚠️ important

    if (updateError) {
      return NextResponse.json({ error: updateError.message });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}