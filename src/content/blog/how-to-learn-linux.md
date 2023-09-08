---
type: article
title: 'How to Learn Linux'
description: 'A'
author: joshua-unrau
language: en
datePublished: 2023-09-05
---

To leverage the full potential of the DNP, a general understanding Linux is crucial. I have seen far too many researchers struggle with even the simplest of tasks, in some cases, for many years. It doesn't have to be this way. As someone who began their Linux journey in academic research, here are some tips to help navigate this learning curve more effectively.

## Learn the Basics First

Before attempting to do anything complicated, I recommend taking a few days to understand the basics of the shell: the shell, the path variable, common commands, and the fundamental structure of the filesystem.

Once, I saw a DNP user struggling for a week to understand why they could not run a command. The issue? The program they were attempting to execute wasn't in their path. If that person spent a few hours reading before getting started, they would have saved themselves a lot of pain and suffering.

Learning Linux is a lot like learning a language: the best way to learn is by practice and through trial and error. That said, understanding the basic concepts is essential, just like understanding the fundamental grammatical structures in a language is important. I recommend checking out [The Art of Command Line](https://github.com/jlevy/the-art-of-command-line) as a starting point.

## Read Documentation

A pitfall for many newcomers to Linux is the tendency to blindly copy-paste commands from the web without truly grasping the underlying problem. This becomes especially hazardous when using commands prefixed with `sudo`. Ensure you fully understand a command before executing it with elevated privileges.

Although searching the internet for resources is a great idea, it is also important to understand why the solution you found works. Otherwise, you will find yourself copying the same commands for years.

The [Arch Wiki](https://wiki.archlinux.org/) is a great resource. Alternatively, if you need help with a single command, you can use `man` to open the manual. For example:

```shell
man bash
```

However, these manual pages can be dense for beginners. I find a package called [tldr](https://github.com/tldr-pages/tldr) really helpful. Once you have installed it, you can quickly get a view brief summary and examples of common usage, for example:

```shell
tldr bash
```

## Be Efficient

In my experience, people often spend much more time trying to hack together a quick fix that they do not understand, when one could sit down and learn the actual issue in a fraction of the time.

## Read Error Messages

Of course, sometimes you do not know what you need to know. When you encounter an error, the first thing you should do is read the entire error message. Think about what the message could mean and then, if you cannot figure it out, copy-paste the error message verbatim into Google. Often, someone on stackoverflow or GitHub will have ran into the same problem, and has a solution. As I said earlier, though, don't just copy their solution. Take the time to understand, at least generally, what the issue was and how it was solved. This might take some more time, but I promise in the long run you will save much more time, and it will be much less frustrating.

## Ask For Help If You Need It

Although the Linux and broader open-source community can sometimes be intimidating, the overwhelming majority of people will be happy to help. However, most people will expect that you make at least some effort to solve the problem on your own before asking for help. So, if you have read the error message, searched online and found nothing, ask for help - but make sure to give the community the information they need to help you. This means explaining:

1. What you’re doing, or trying to do
2. The distribution of Linux you are using
3. The version of any software you are using (e.g., Python)
4. The exact error message you are getting
5. the complete paths/access to the inputs, outputs, and log
6. what you tried to do to solve your problem (in detail) and the results
