"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getURL, getErrorRedirect, getStatusRedirect } from "utils/helpers";
import { getAuthTypes } from "utils/auth-helpers/settings";

function isValidEmail(email: string) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

export async function redirectToPath(path: string) {
    return redirect(path);
}

export async function SignOut(formData: FormData) {
    const pathName = String(formData.get("pathName")).trim();

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return getErrorRedirect(
            pathName,
            "Hmm... Noget gik galt.",
            "Af en eller anden grund ku´ vi ik´ logge dig ud.",
        );
    }

    return "/signin";
}

export async function signInWithEmail(formData: FormData) {
    const cookieStore = cookies();
    const callbackURL = getURL("/auth/callback");

    const email = String(formData.get("email")).trim();
    let redirectPath: string;

    if (!isValidEmail(email)) {
        redirectPath = getErrorRedirect(
            "/signin/email_signin",
            "Ugyldig email adresse.",
            "Prøv lige igen!.",
        );
    }

    const supabase = createClient();
    let options = {
        emailRedirectTo: callbackURL,
        shouldCreateUser: true,
    };

    // If allowPassword is false, do not create a new user
    const { allowPassword } = getAuthTypes();
    if (allowPassword) options.shouldCreateUser = false;
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: options,
    });

    if (error) {
        redirectPath = getErrorRedirect(
            "/signin/email_signin",
            "Vi ku´sku ik´logge dig ind!.",
            error.message,
        );
    } else if (data) {
        cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
        redirectPath = getStatusRedirect(
            "/signin/email_signin",
            "Succes!",
            "Tjek lige din mail for det Magiske link vi har sendt dig.",
            true,
        );
    } else {
        redirectPath = getErrorRedirect(
            "/signin/email_signin",
            "Hmm... Noget gik galt.",
            "Vi ku´ik´lige logge dig ind.",
        );
    }

    return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
    const callbackURL = getURL("/auth/reset_password");

    // Get form data
    const email = String(formData.get("email")).trim();
    let redirectPath: string;

    if (!isValidEmail(email)) {
        redirectPath = getErrorRedirect(
            "/signin/forgot_password",
            "Ugyldig email adresse.",
            "Prøv lige igen.",
        );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackURL,
    });

    if (error) {
        redirectPath = getErrorRedirect(
            "/signin/forgot_password",
            error.message,
            "Aaaah, prøv lige igen du.",
        );
    } else if (data) {
        redirectPath = getStatusRedirect(
            "/signin/forgot_password",
            "Succes!",
            "Tjek din mail for Password reset-link vi har sendt til dig.",
            true,
        );
    } else {
        redirectPath = getErrorRedirect(
            "/signin/forgot_password",
            "Hmm... Noget gik galt.",
            "Password reset-email ku´ af en eller anden grund ik´sendes!",
        );
    }

    return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
    const cookieStore = cookies();
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password")).trim();
    let redirectPath: string;

    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirectPath = getErrorRedirect(
            "/signin/password_signin",
            "Login fejlede!.",
            error.message,
        );
    } else if (data.user) {
        cookieStore.set("preferredSignInView", "password_signin", {
            path: "/account",
        });
        redirectPath = getStatusRedirect(
            "/account",
            "Succes!",
            "Du er nu logget ind.",
        );
    } else {
        redirectPath = getErrorRedirect(
            "/signin/password_signin",
            "Hmm... Noget gik galt.",
            "Vi ku´ik´logge dig ind!",
        );
    }

    return redirectPath;
}

export async function signUp(formData: FormData) {
    const callbackURL = getURL("/auth/callback");

    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password")).trim();
    let redirectPath: string;

    if (!isValidEmail(email)) {
        redirectPath = getErrorRedirect(
            "/signin/signup",
            "Ugyldig email adresse.",
            "Prøv lige igen du.",
        );
    }

    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: callbackURL,
        },
    });

    if (error) {
        redirectPath = getErrorRedirect(
            "/signin/signup",
            "Brugeroprettelse fejlede!",
            error.message,
        );
    } else if (data.session) {
        redirectPath = getStatusRedirect("/", "Succes!", "Du er nu logget ind.");
    } else if (
        data.user &&
        data.user.identities &&
        data.user.identities.length == 0
    ) {
        redirectPath = getErrorRedirect(
            "/signin/signup",
            "Brugeroprettelse fejlede!.",
            "Der er allerede en konto tilknyttet den email. Prøv evt. at resette dit password?",
        );
    } else if (data.user) {
        redirectPath = getStatusRedirect(
            "/welcome",
            "Succes!",
            "Tjek din mail for verifikations-link. Du kan nu lukke det her vindue.",
        );
    } else {
        redirectPath = getErrorRedirect(
            "/signin/signup",
            "Hmmm... Noget gik galt!.",
            "Vi ku´sku ik´ oprette dig.",
        );
    }

    return redirectPath;
}

export async function updatePassword(formData: FormData) {
    const password = String(formData.get("password")).trim();
    const passwordConfirm = String(formData.get("passwordConfirm")).trim();
    let redirectPath: string;

    // Check that the password and confirmation match
    if (password !== passwordConfirm) {
        redirectPath = getErrorRedirect(
            "/signin/update_password",
            "Dit passwortd ku´ ik´ opdateres.",
            "Passwords var ik´ens!.",
        );
    }

    const supabase = createClient();
    const { error, data } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        redirectPath = getErrorRedirect(
            "/signin/update_password",
            "Dit passwortd ku´ ik´ opdateres.",
            error.message,
        );
    } else if (data.user) {
        redirectPath = getStatusRedirect(
            "/",
            "Succes!",
            "Dit passwortd er opdateret.",
        );
    } else {
        redirectPath = getErrorRedirect(
            "/signin/update_password",
            "Hmm... Noget gik galt.",
            "Dit passwortd ku´ ik´ opdateres.",
        );
    }

    return redirectPath;
}

export async function updateEmail(formData: FormData) {
    // Get form data
    const newEmail = String(formData.get("newEmail")).trim();

    // Check that the email is valid
    if (!isValidEmail(newEmail)) {
        return getErrorRedirect(
            "/account",
            "Din email ku´ ik´ opdateres.",
            "Ugyldig email adresse.",
        );
    }

    const supabase = createClient();

    const callbackUrl = getURL(
        getStatusRedirect("/account", "Succes!", `Din email er opdateret.`),
    );

    const { error } = await supabase.auth.updateUser(
        { email: newEmail },
        {
            emailRedirectTo: callbackUrl,
        },
    );

    if (error) {
        return getErrorRedirect(
            "/account",
            "Din email ku´ ik´ opdateres.",
            error.message,
        );
    } else {
        return getStatusRedirect(
            "/account",
            "Verifikations-email er sendt til dig.",
            `Du skal både godkende på din gamle og din nye emailadresse så vi er sikre på det er dig.`,
        );
    }
}

export async function updateName(formData: FormData) {
    // Get form data
    const fullName = String(formData.get("fullName")).trim();

    const supabase = createClient();
    const { error, data } = await supabase.auth.updateUser({
        data: { full_name: fullName },
    });

    if (error) {
        return getErrorRedirect(
            "/account",
            "Dit navn ku´ ik´ opdateres!.",
            error.message,
        );
    } else if (data.user) {
        return getStatusRedirect("/account", "Succes!", "Dit navn er opdateret.");
    } else {
        return getErrorRedirect(
            "/account",
            "Hmm... Noget gik galt.",
            "Dit navn ku´ ik´ opdateres!.",
        );
    }
}
