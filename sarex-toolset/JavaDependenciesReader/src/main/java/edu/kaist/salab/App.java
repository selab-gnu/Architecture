package edu.kaist.salab;

import org.objectweb.asm.ClassReader;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Vector;


public class App {
    private static Vector<Path> readClassFiles(String pathStr) throws IOException {
        Path classpath = Paths.get(pathStr);
        final Vector<Path> files = new Vector<>();

        Files.walkFileTree(classpath, new SimpleFileVisitor<Path>(){
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                if (file.toString().endsWith(".class")) {
                    files.add(file);
                }

                return FileVisitResult.CONTINUE;
            }
        });

        return files;
    }

    public static void main( String[] args ) {
        if (args.length != 1) {
            System.out.println("Need a classpath");
            System.exit(1);
        }

        try {
            Vector<Path> files = readClassFiles(args[0]);

            for (Path file : files) {
                ClassReader reader = new ClassReader(Files.newInputStream(file));
                reader.accept(new DependencyVisitor(), ClassReader.SKIP_FRAMES);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
